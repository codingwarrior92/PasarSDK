import { useState, useEffect } from "react";
import { Category, MyProfile, SocialLinks, AppContext } from "@crypto-dev/pasar-sdk-development";

const UpdateCollectionInfo = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [avatar, setAvatar] = useState();
    const [background, setBackground] = useState();
    const [collectionAddress, setCollectionAddress] = useState("");
    const [category, setCategory] = useState(Object.keys(Category)[0]);
    const socialLinks = new SocialLinks();

    const handleMint = async () => {
        let user = JSON.parse(localStorage.getItem("user"));
        try {
            console.log(name);
            console.log(description);
            console.log(category);
            const myProfile = new MyProfile(AppContext.getInstance(), user['did'], user['address'], user['name'], user['bio'], null);
            let metaData = await myProfile.createCollectionURI(category, description, avatar, background, socialLinks);
            await myProfile.updateCollectionUri(collectionAddress, name, metaData);
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <div>
            <div>
                <h3>Collection Address</h3>
                <input value={collectionAddress} onChange={(e) => setCollectionAddress(e.target.value)}/>
            </div>
            
            <div>
                <h3 className="sub_title">Avatar</h3>
                <input type="file" onChange={e => setAvatar(e.target.files[0])}/>
            </div>
            <div>
                <h3 className="sub_title">Background</h3>
                <input type="file" onChange={e => setBackground(e.target.files[0])}/>
            </div>
            <div>
                <h3 className="sub_title">Name</h3>
                <input value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div>
                <h3 className="sub_title">Description</h3>
                <input value={description} onChange={(e) => setDescription(e.target.value)}/>
            </div>
            <div>
                <h3>Category</h3>
                <select onChange={(e) => setCategory(e.target.value)}>
                    {Object.keys(Category).map((key) => {
                        return <option key={Category[key]} value={Category[key]}>{Category[key]}</option>
                    })}
                </select>
            </div>
            <div>
            <button onClick={handleMint}>Update Collection Info</button>                
            </div>
        </div>
    );
}

export default UpdateCollectionInfo;
