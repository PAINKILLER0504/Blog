import React, { useContext } from 'react'
import NoteCard from '../components/NoteCard'
import Controls from '../components/Controls';
import { NoteContext } from '../context/NoteContext';
export default function Notepage() {
   const {notes}=useContext(NoteContext)
    return (
        <div>
            {notes.map(note => (<NoteCard key={note.$id} note={note} />))}
            <Controls />
        </div>
    )
}
