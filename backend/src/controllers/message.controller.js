import User from "../models/user.model.js";
import Message from "../models/message.model.js"

export const getUsersForSidebar = async (req,res) => {
    try {
        const loggedInUserId = req.user._id; // here we get our Id
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password") // here we find all the ids minus our id and remove the password cause we dont wanna send the password back to the client

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getMessages = async (req,res) => {
    try {
        const { id:userToChatId } = req.params //we called it id in the get request
        const myId = req.user._id; //this is my id, the current authenticated user

        const messages = await Message.find({ // fetching all the messages where cont...
            $or: [                                             //or condition 
                {senderId: myId, receiverId: userToChatId}, //im the sender 
                {senderId: userToChatId, receiverId: myId} //im the receiver
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error:"Internal server error" })
    }
}

export const sendMessage = async (req,res) => { 
    // the message could be a text or an image
    try {
        const { text,image } = req.body;
        const {id: reveiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl; // we check if the user is uploading an image here 
        if (image) {
            //Uplaod base64 image to cloudinary
            const uplaodResponse = await cloudinary.uplaoder.upload(image); // if theres an image we can upoad that to cloudinary
            imageUrl = uplaodResponse.secure_url // then well take that secureUrl and assign it to the imageUrl
        }

        const newMessage = new Message({ //create the message with the image
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        await newMessage.save(); // save it to the database

        //todo: realtime functionality goes here => socket.io

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}