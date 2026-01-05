import userModel from '../model/usermodel.js';


export const getUserData = async(req,res)=>{
    try{
        const id= req.user.id;
        console.log("id is",id);
        const user = await userModel.findById(id);
        if(!user){
            return res.json({
                success:false,
                message:"user not present in db"
            })
        }

        res.json({
            success:true,
            userData:{
                name:user.name,
                isVerified:user.isVerified
            }
        })


    }catch(e){
        return res.json({
            success:false,
            message:e.message
        })
    }
}