import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <main className='w-full'>
     <article className='flex'>
      <aside className='w-full max-w-[17vw]'><Sidebar /></aside>
     <section className='w-full'>
      <Header />
        {children}
      </section>
     </article>
    </main>
  );
};


export default AdminLayout