import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';


export default function OwnerListing() {
    const { currentUser } = useSelector((state) => state.user);
    const [file, setFile] = useState(undefined);
    const [formData, setFormData] = useState({});
    const [showListingsError, setShowListingsError] = useState(false);
    const [userListings, setUserListings] = useState([]);

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    useEffect(() => {
        // Fetch user's listings when the component mounts
        const fetchUserListings = async () => {
            try {
                setShowListingsError(false);
                const res = await fetch(`/api/user/listings/${currentUser._id}`);
                const data = await res.json();
                if (data.success === false) {
                    setShowListingsError(true);
                    return;
                }

                setUserListings(data);
            } catch (error) {
                setShowListingsError(true);
            }
        };

        fetchUserListings(); // Call the function to fetch listings
    }, [currentUser._id]); // Trigger the effect when currentUser._id changes

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePerc(Math.round(progress));
            },
            (error) => {
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                    setFormData({ ...formData, avatar: downloadURL })
                );
            }
        );
    };

    const handleListingDelete = async (listingId) => {
        // Show a confirmation dialog
        Swal.fire({
          title: 'Are you sure?',
          text: 'You will not be able to recover this listing!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, keep it',
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const res = await fetch(`/api/listing/delete/${listingId}`, {
                method: 'DELETE',
              });
              const data = await res.json();
              if (data.success === false) {
                console.log(data.message);
                return;
              }
      
              setUserListings((prev) =>
                prev.filter((listing) => listing._id !== listingId)
              );
      
              // Show a success message
              Swal.fire('Deleted!', 'Your listing has been deleted.', 'success');
            } catch (error) {
              console.log(error.message);
      
              // Show an error message
              Swal.fire('Error', 'There was an error deleting the listing.', 'error');
            }
          }
        });
      };
      


    return (
        <div className='p-3 max-w-lg mx-auto'>

            <p className='text-red-700 mt-5'>
                {showListingsError ? 'Error showing listings' : ''}
            </p>
            {userListings && userListings.length < 0 && (
                <>
                    <p className='text-center text-lg font-semibold'>
                        You don't have any listing property.
                    </p>
                    <div className='text-center mt-4'>
                        <Link
                            to={`/create-listing`}
                            className='bg-green-700 text-white py-2 px-4 rounded-lg text-lg hover:opacity-95'
                        >
                            Add your property
                        </Link>
                    </div>
                </>
            )}
            {userListings && userListings.length > 0 && (
                <div className='flex flex-col gap-4'>

                    {userListings.map((listing) => (
                        <div className='flex flex-col gap-4'>
                            <h1 className='text-center mt-7 text-2xl font-semibold'>
                                Your Listings
                            </h1>
                            {userListings.map((listing) => (
                                <div
                                    key={listing._id}
                                    className='border rounded-lg p-3 flex justify-between items-center gap-4'
                                >
                                    <Link to={`/listing/${listing._id}`}>
                                        <img
                                            src={listing.imageUrls[0]}
                                            alt='listing cover'
                                            className='h-16 w-16 object-contain'
                                        />
                                    </Link>
                                    <Link
                                        className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                                        to={`/listing/${listing._id}`}
                                    >
                                        <p>{listing.name}</p>
                                    </Link>

                                    <div className='flex flex-col item-center'>
                                        <button
                                            onClick={() => handleListingDelete(listing._id)}
                                            className='text-red-700 uppercase'
                                        >
                                            Delete
                                        </button>
                                        <Link to={`/update-listing/${listing._id}`}>
                                            <button className='text-green-700 uppercase'>Edit</button>
                                        </Link>

                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}


        </div>
    );
}
