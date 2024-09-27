import React, { useContext } from 'react'
import colors from '../assets/colors.json'
import { NoteContext } from '../context/NoteContext'
import{ db }from '../appwrite/databases'

export default function Colors() {
    const{selectedNote, notes,setNotes}=useContext(NoteContext)
    function ChangeColor(e) {
        try {
            
            const currentNoteId = notes.findIndex(note => note.$id === selectedNote.$id);

            console.log(currentNoteId);
            const updateNots={
                ...notes[currentNoteId],
                colors: colors[e.target.id]
            }
            const NewNots = [...notes];
            NewNots[currentNoteId] = updateNots;

            setNotes(NewNots)
            db.notes.update(selectedNote.$id,{colors:JSON.stringify( colors[e.target.id])})
                        
        } catch (error) {
            alert("选中一张卡片更换颜色")
        }
    }
    return (
        <div className='colors'>
            {colors.map((color,index) => {
                return <div className='color'
                    key={color.id}
                    id={index}
                    onClick={(e)=>ChangeColor(e)}
                    style={{ backgroundColor: color.colorHeader }}></div>
            })}
        </div>
    )
}
