import React from "react"
import logo from "../assets/whitelogo.png"

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <div>
      <section className='bg-red-600 grid grid-cols-1 lg:grid-cols-2 place-content-center place-items-center md:py-5 lg:py-20'>
        <div className='flex flex-col py-10 gap-10 justify-center items-center sm:px-5 md:px-20 '>
          <p className='sm:text-2xl md:text-4xl font-bold text-white text-center'>
            What can we help you achieve?
          </p>
          <a
            href='https://superlabs.co/contact-us'
            target='blank'
            className='flex w-48 font-bold items-center justify-center px-4 py-3 text-base  leading-6  whitespace-no-wrap bg-red-600 border-2 border-white rounded-full shadow-sm hover:bg-transparent text-white hover:text-black hover:bg-white  focus:outline-none'
          >
            Let's Get To Work
          </a>
        </div>
        <div className='flex lg:border-l flex-col py-10 gap-10 justify-center items-center sm:px-5 md:px-20 '>
          <p className='md:border-t sm:border-t lg:border-t-0 sm:pt-16 lg:pt-0   sm:text-2xl md:text-4xl font-bold text-white text-center'>
            Where will your career take you?
          </p>
          <a
            href='https://superlabs.co/careers'
            target='blank'
            className='flex w-48 font-bold items-center justify-center px-4 py-3 text-base  leading-6  whitespace-no-wrap bg-red-600 border-2 border-white rounded-full shadow-sm hover:bg-transparent text-white hover:text-black hover:bg-white  focus:outline-none'
          >
            Come Find Out Now
          </a>
        </div>
      </section>
      <section className='grid grid-cols-1 lg:grid-cols-2 bg-black pb-10 lg:py-16 sm:px-5 md:px-40'>
        <div className='flex justify-start items-center'>
          <img src={logo} alt='logo' className='sm:h-[200px] md:h-[250px]' />
        </div>
        <div className='text-gray-400 grid grid-cols-1 md:grid-cols-2 gap-10 lg:grid-cols-3 place-content-center place-items-start'>
          <ul className='space-y-2'>
            <li className='py-3 font-bold text-lg text-white'>
              SuperLabs Info
            </li>
            <li>
              <a
                href='https://blog.superlabs.co/'
                target='blank'
                className='cursor-pointer hover:text-red-600'
              >
                Super Insights
              </a>
            </li>
            <li>
              <a
                href='https://superlabs.co/corporate-information.php'
                target='blank'
                className='cursor-pointer hover:text-red-600'
              >
                Corporate Information
              </a>
            </li>
            <li>
              <a
                href='https://superlabs.co/careers.php'
                target='blank'
                className='cursor-pointer hover:text-red-600'
              >
                Careers
              </a>
            </li>
            <li>
              <a
                href='https://status.superlabs.co/dashboard'
                target='blank'
                className='cursor-pointer hover:text-red-600'
              >
                Services Uptime
              </a>
            </li>
            <li>
              <a
                href='https://superlabs.co/contact-us.php'
                target='blank'
                className='cursor-pointer hover:text-red-600'
              >
                Contact
              </a>
            </li>
          </ul>
          <ul className='space-y-2'>
            <li className='py-3 font-bold text-lg text-white'>Employees</li>
            <li>
              <a
                href='https://comm.superlabs.co/'
                target='blank'
                className='cursor-pointer hover:text-red-600'
              >
                SuperComm
              </a>
            </li>
            <li>
              <a
                href='https://superlabs.co:2096/'
                target='blank'
                className='cursor-pointer hover:text-red-600'
              >
                SuperMail
              </a>
            </li>
            <li>
              <a
                href='https://fork-n-code.superlabs.co/'
                target='blank'
                className='cursor-pointer hover:text-red-600'
              >
                SuperGit
              </a>
            </li>
            <li>
              <a
                href='https://careers-admin.superlabs.co/'
                target='blank'
                className='cursor-pointer hover:text-red-600'
              >
                SuperCareers
              </a>
            </li>
            <li>
              <a
                href='https://crm.superlabs.co/'
                target='blank'
                className='cursor-pointer hover:text-red-600'
              >
                SuperCRM
              </a>
            </li>
            <li>
              <a
                href='https://meet.google.com/uni-zeez-nzi'
                target='blank'
                className='cursor-pointer hover:text-red-600'
              >
                SuperMeet
              </a>
            </li>
            <li>
              <a
                href='https://blog.superlabs.co/ghost/#/signin'
                target='blank'
                className='cursor-pointer hover:text-red-600'
              >
                SuperGhost
              </a>
            </li>
            <li>
              <a
                href='https://bytebox.superlabs.co/'
                target='blank'
                className='cursor-pointer hover:text-red-600'
              >
                Byte Box
              </a>
            </li>
          </ul>
          <ul className='space-y-2'>
            <li className='py-3 font-bold text-lg text-white'>Vendor Info</li>
            <li>
              <a
                href='https://superlabs.co/supplier-connection.php'
                target='blank'
                className='cursor-pointer hover:text-red-600'
              >
                Partner with Us
              </a>
            </li>
          </ul>
        </div>
      </section>
      <section className='bg-black '>
        <div className='flex border-t border-gray-900 sm:mx-5 md:mx-36  py-10'>
          <p className='text-gray-400 text-center'>
            © 2020 - {currentYear} SuperLabs. Acta Non Verba.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Footer
