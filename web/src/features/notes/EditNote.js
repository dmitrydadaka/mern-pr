import { useParams } from 'react-router-dom'
import EditNoteForm from './EditNoteForm'
import { useGetUsersQuery } from '../users/usersApiSlice'
import { useGetNotesQuery } from './notesApiSlice'
import useAuth from '../../hooks/useAuth'
import { PulseLoader } from 'react-spinners/PulseLoader'

const EditNote = () => {

    const { id } = useParams()
    const { username, isManager, isAdmin } = useAuth()

    const { users } = useGetUsersQuery( 'usersList', {
        selectFromResult: ({data}) => ({
            user: data?.entities[id]
        })
    })

    const { note } = useGetNotesQuery( 'notesList', {
        selectFromResult: ({data}) => ({
            note: data?.entities[id]
        })
    })

    if(!note || !users.length) return <PulseLoader color={'#FFF'} />
    if(!isAdmin && isManager) {
        if(note.username !== username) return <p className='errmsg'> No Access </p>
    }

    const content = <EditNoteForm note={note} users={users} /> 

    return content
}

export default EditNote
