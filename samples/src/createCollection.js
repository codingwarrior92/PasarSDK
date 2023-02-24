import { useState, useEffect } from "react";
import { MyProfile, Category, ERCType, SocialLinks, AppContext } from "@crypto-dev/pasar-sdk-development";

const CreateCollection = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [symbol, setSymbol] = useState('');
    const [avatar, setAvatar] = useState();
    const [background, setBackground] = useState();
    const [category, setCategory] = useState(Object.keys(Category)[0]);
    const [progress, setProgress] = useState(0);
    
    const socialLinks = new SocialLinks();
    
    useEffect(() => {
        console.log(progress);
    }, [progress]);
    
    const handleMint = async () => {
        let user = JSON.parse(localStorage.getItem("user"));
        let royalty = [{receiptAddr: user['address'], value: 10}];

        console.log(name);
        console.log(description);
        console.log(category);
        console.log(royalty);
        try {
            const myProfile = new MyProfile(AppContext.getInstance(), user['did'], user['address'], user['name'], user['bio'], null);

            let metaData = await myProfile.createCollectionURI(category, description, avatar, background, socialLinks);
            console.log(metaData);
            let address = await myProfile.createCollection(name, symbol);
            console.log(address);
            await myProfile.registerCollection(address, name, metaData, royalty)
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <div>
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
                <h3 className="sub_title">Symbol</h3>
                <input value={symbol} onChange={(e) => setSymbol(e.target.value)}/>
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
            <button onClick={handleMint}>Create Collection</button>                
            </div>
        </div>
    );
}

export default CreateCollection;
