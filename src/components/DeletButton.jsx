import React, { useContext } from 'react'
import Trush from '../icons/Trash'
import {db} from '../appwrite/databases'
import { NoteContext } from '../context/NoteContext'


export default function DeletButton({noteId}) {
    const {setNotes}=useContext(NoteContext)
    const deletcard = async() => {
        const yorn =confirm('确定删除吗？')
        if (yorn) {
            db.notes.delete(noteId);
        setNotes(prev => prev.filter(note => note.$id !== noteId))
        }
        
    }
    return (
        <div
            onClick={deletcard}><Trush /></div>
    )
}
