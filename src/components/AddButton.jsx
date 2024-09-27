import React, { useContext, useRef } from 'react'
import colors from '../assets/colors.json'
import {db} from '../appwrite/databases'
import Addicon from '../icons/Addicon'
import { NoteContext } from '../context/NoteContext'
export default function AddButton() {
    const {setNotes}=useContext(NoteContext)
    const startPos = useRef(10)
    const AddCard = async() => {        
        const payload = {
            body: '记录你的新想法',
            position: JSON.stringify({ x: startPos.current, y: startPos.current }),
            colors: JSON.stringify(colors[Math.floor(Math.random() * colors.length)])
        }
        startPos.current+=20
        
        const response= await db.notes.create(payload)
        setNotes(prev=>[...prev,response])        
    }
    
    return (
        <div id="add-btn"
        onClick={AddCard}>
            <Addicon />
            </div>
    )
}
