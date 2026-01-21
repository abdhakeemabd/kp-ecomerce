import React from 'react'
import User from '../assets/images/img/1.webp'
import ProfileBanner from './profile-banner'
function Profile() {
  return (
    <>
      <ProfileBanner/>
      <section className='profile_sec'>
        <div className="container">
            <div className="grid grid-col-1 md:grid-cols-12 gap-6 py-30">
                <div className="md:col-span-4">
                  <div className="profile-img-card bg-blue-950 text-white rounded-xl p-3">
                    <div>
                        <img className='rounded-full h-30 w-30 object-cover mb-2' src={User} alt={'q'} />
                    </div>
                    <div className=''>Hello, Good Evening</div>
                    <div className='text-xl font-semibold capitalize'>person name</div>
                  </div>
                </div>
                <div className="md:col-span-8">
                    <div className="card shadow-lg bg-white p-3 rounded-lg">
                        <div className='border-b-1 border-green-900 py-3 mb-3 text-xl font-semibold'>Personal Info</div>
                        <div className='mb-1 text-[14px]  text-[#1c1c1c]'>Whatsapp Number</div>
                        <div className='mb-2 text-[14px]  text-[#1c1c1c]'>99999999999</div>
                        <div className='mb-1 text-[14px] text-[#1c1c1c]'>Email Address</div>
                        <div className='mb-2 text-[14px]  text-[#1c1c1c]'>abcdefghifk@gmail.com</div>
                        <div className='mb-1 text-[14px] text-[#1c1c1c]'>Gender</div>
                        <div className='mb-2 text-[14px]  text-[#1c1c1c]'>Male</div>
                        <div className='mb-1 text-[14px] text-[#1c1c1c]'>Address</div>
                        <div className='mb-2 text-[14px]  text-[#1c1c1c]'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusantium, temporibus. Eligendi beatae ipsa cumque, harum pariatur consectetur natus fugit voluptate.</div>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </>
  )
}

export default Profile