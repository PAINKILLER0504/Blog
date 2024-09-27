import {createContext,useEffect,useState} from 'react'
import Loading from "../components/Loading";
import {db }from '../appwrite/databases'

export const NoteContext=createContext()
const NoteProvider=({children})=>{
    const [loading, setLoading] = useState(true)
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    useEffect(() => {
        init()
    }, [])

    const init = async () => {
        const response = await db.notes.list()
        setNotes(response.documents)
        setLoading(false)
    }
    
    const contextData={notes,setNotes,selectedNote,setSelectedNote}
    return (
    <NoteContext.Provider value= {contextData}>{loading?  <Loading/> :children}</NoteContext.Provider>
)
}
export default NoteProvider;