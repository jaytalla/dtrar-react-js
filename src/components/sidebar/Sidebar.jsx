import React, { useEffect, useState } from 'react';
import { useAuth } from "@/contexts/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Sidebar() {
  const [user, setUser] = useState(null);
  const { signOutUser } = useAuth();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className='flex flex-col justify-between w-[20%] h-full bg-slate-900 min-w-[250px]'>
      <div className='w-full h-full p-4'>
        <div className='w-full h-fit p-4 rounded-md bg-indigo-50 flex items-center gap-4'>
          {user ? (
            <>
              {/* Profile Picture */}
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
              )}
              {/* Name or Email */}
              <h1 className='text-lg font-semibold'>
                Welcome {user.displayName || user.email}
              </h1>
            </>
          ) : (
            <h1>No user logged in</h1>
          )}
        </div>
      </div>

      <div className='bottom-2 w-full h-fit'>
        <button
          className='w-full text-white bg-indigo-950 p-4'
          onClick={() => signOutUser()}
        >
          SIGNOUT
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
