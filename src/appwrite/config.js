
import { Client, Databases } from "appwrite";
 
const client = new Client()
    // .setEndpoint(import.meta.env.VITE_ENDPOINT)
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66f155d5000c14bfd335');
 
const databases = new Databases(client);

const collections = [{
    name :"notes",
    // id: import.meta.env.VITE_COLLECTION_NOTES_ID,
    // dbID: import.meta.env.VITE_DATABASE_ID
      id: '66f1566f002c6fe5856c',
    dbID: '66f15646003ad9853da0'
}]

export { client, databases ,collections}