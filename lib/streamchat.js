import { StreamChat } from 'stream-chat';
const Client = StreamChat.getInstance("283u2ftt83su")
let chan;
export const requestNewUserToken = async (userid, username) => {
    console.log(username)
    const data = await fetch("https://sibes.tk/createstreamusertoken", {
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            userid: userid,
        }),
        method: "POST",
    })
    const result = await data.json()
    return result;
}
export const setChannel = (channel) => {
    chan=channel
}
export const getChannel = () => {
    return chan;
}
