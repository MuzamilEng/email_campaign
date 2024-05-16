import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
// import Sidebar from '../components/Sidebar/Livraria/Sidebar';

const Layout = ({ children }) => {
  return (
    <main className='w-full'>
      <Header />
     <article className='flex'>
      {/* <aside className='w-full max-w-[20vw]'><Sidebar /></aside> */}
     <section className='w-full'>
        {children}
      </section>
     </article>
    </main>
  );
};

export default Layout;
