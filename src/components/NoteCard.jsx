import React, { useEffect, useRef, useState,useContext} from 'react'
import { db } from '../appwrite/databases'
import DeletButton from './DeletButton'
import{NoteContext}from '../context/NoteContext'

export default function NoteCard({ note}) {
    const body = BodyParser(note.body)
    const [position, setPosation] = useState(BodyParser(note.position))
    const [saving, setSaving] = useState(false)
    const colors = BodyParser(note.colors)
    const [updatetime, setUpdatetime] = useState(BodyParser(note.updatetime))
    let mouseStartPos = { x: 0, y: 0 };
    const textAreaRef = useRef(null)
    const cardRef = useRef(null)
    const {setSelectedNote}=useContext(NoteContext)

    useEffect(() => {
        autoGrow(textAreaRef)
        setIndexZ(cardRef.current)
        if (typeof (updatetime) !== "string") { setUpdatetime(handleUpdateTime(updatetime)) }
    }, [])
    //判断数据类型如果是string就返回原值，否则就返回JSON.parse(value)
    function BodyParser(value) {
        try {
            return JSON.parse(value)
        } catch (error) {
            return value
        }
    }
    // 调整卡片输入框自适应高度,didmount以及编辑内容时都需要自适应高度
    function autoGrow(textAreaRef) {
        const { current } = textAreaRef
        current.style.height = "auto"
        current.style.height = current.scrollHeight + "px"
    }
    function oninput() {
        autoGrow(textAreaRef)
    }

    function MouseDown(event) {
        if (event.target.className === "card-header") {
            setIndexZ(cardRef.current)
            setSelectedNote(note)
            mouseStartPos = {
                x: event.clientX,
                y: event.clientY
            }
            document.addEventListener("mousemove", moveNote)
            document.addEventListener("mouseup", mouseUp)
            document.addEventListener("touchmove", moveNote, { passive: false })
            document.addEventListener("touchend", mouseUp)
        }

    }


    function moveNote(event) {
        //防止移动端滚动事件影响拖动
        event = event || window.event
        event.preventDefault()
        const mouseMoveDir = {
            x: mouseStartPos.x - (event.clientX || event.touches[0].clientX),
            y: mouseStartPos.y - (event.clientY || event.touches[0].clientY)
        }

        mouseStartPos = {
            x: event.clientX || event.touches[0].clientX,
            y: event.clientY || event.touches[0].clientY
        }
        //当拖动到顶部或左边边界时，不允许继续拖动
        setPosation({
            x: (cardRef.current.offsetLeft - mouseMoveDir.x) < 0 ? 0 : cardRef.current.offsetLeft - mouseMoveDir.x,
            y: (cardRef.current.offsetTop - mouseMoveDir.y) < 0 ? 0 : cardRef.current.offsetTop - mouseMoveDir.y
        })

    }
    function mouseUp() {
        document.removeEventListener("mousemove", moveNote)
        document.removeEventListener("mouseup", mouseUp)
        document.removeEventListener("touchmove", moveNote)
        document.removeEventListener("touchend", mouseUp)
        //上传位置到数据库
        const newPosition = {
            x: (cardRef.current.offsetLeft) < 0 ? 0 : cardRef.current.offsetLeft,
            y: (cardRef.current.offsetTop) < 0 ? 0 : cardRef.current.offsetTop
        }
        saveData("position", JSON.stringify(newPosition))
        
    }
    async function saveData(key, value) {
        const payload = { [key]: value }
        try {
            await db.notes.update(note.$id, payload)
        } catch (error) {
            console.error(error);
        }        
    }


    function handleUpdateTime(updatetime) {
        if (updatetime === null) {
            return null
        }
        const updateTime = new Date(updatetime);
        const year = updateTime.getFullYear()
        const month = updateTime.getMonth() + 1;
        const day = updateTime.getDate();
        let h = updateTime.getHours()
        let m = updateTime.getMinutes()
        let s = updateTime.getSeconds()
        h = h > 9 ? h : `0${h}`
        m = m > 9 ? m : `0${m}`
        s = s > 9 ? s : `0${s}`
        if (updateTime.toDateString() === new Date().toDateString()) {
            return `今天${h}:${m}:${s}`
        } else if (updateTime.toDateString() === new Date(Date.now() - 86400000).toDateString()) {
            return `昨天${h}:${m}:${s}`
        } else
            return `${year}年${month}月${day}日${h}:${m}:${s}`



    }

    const timer = useRef(null);
    const timer2 = useRef(null);
    function handleKeyUp() {
        //键入结束0.5秒后加载saving动画，再两秒后上传数据
        if (timer.current) {
            clearTimeout(timer.current)
            clearTimeout(timer2.current)
        }
        timer.current = setTimeout(() => {
            setSaving(true)
            timer2.current = setTimeout(() => {
                const nowTime = Date.now()
                saveData("body", textAreaRef.current.value)
                saveData("updatetime", nowTime)
                setUpdatetime(handleUpdateTime(nowTime))
                setSaving(false)
            }, 2000);
            
        }, 500);
    }
    //设置当前卡片的z-index在最前方
    function setIndexZ(currentCard) {
        currentCard.style.zIndex = 999
        Array.from(document.querySelectorAll(".card")).forEach(card => {
            if (card !== currentCard) {
                card.style.zIndex = 998
            }
        });
    }


    return (

        <div className='card'
            onMouseDown={() => setIndexZ(cardRef.current)}
            ref={cardRef}
            style={{
                backgroundColor: colors.colorBody,
                left: `${position.x}px`,
                top: `${position.y}px`
            }}
        >
            <div className="card-header"
                onMouseDown={MouseDown}
                onTouchStart={MouseDown}
                style={{ backgroundColor: colors.colorHeader }}
            >
                <span style={{ color: colors.colorText }}>{saving ? "Saving..." : <>{updatetime === null ? "新建卡片" : <>修改时间: {updatetime}</>}</>}</span>
                <DeletButton noteId={note.$id}/>
            </div>
            <div className="card-body">
                <textarea
            
            onFocus={() => { setIndexZ(cardRef.current);setSelectedNote(note) }}
                    onKeyUp={handleKeyUp}
                    name='{note.$id}'
                    onInput={oninput}
                    ref={textAreaRef}
                    style={{ color: colors.colorText }}
                    defaultValue={body}>
                </textarea>

            </div>

        </div>
    )
}
