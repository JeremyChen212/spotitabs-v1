import React from 'react';
import { useState, useEffect} from 'react'
import { getCurrentUserProfile } from '../../spotify';
    
  

const Dashboard = () => {
    const [profile, setProfile] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
              const { data } = await getCurrentUserProfile();
              setProfile(data);
              console.log(data)
            } catch(e) {
              console.error(e);
            }
        }

        fetchData();
    }, []);
    
    return (
        {profile : (
            <>
                <div>
                <h1>{profile.display_name}</h1>
                <p>{profile.followers.total} Followers</p>
                {profile.images.length && profile.images[0].url ? (
                    <div className="pfp-cn">
                        <img src={profile.images[0].url} alt="Avatar"/>
                    </div>
                ) : (
                    <div className="pfp-cn">
                        <img className='default-pfp' src={require('../../img/default-pfp.png' )}alt="Avatar"/>
                    </div>
                )}
                </div>
            </>
        )}
        
    )
}

export default Dashboard;