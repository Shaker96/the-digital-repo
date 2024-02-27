'use client'

import { Dispatch, SetStateAction, useState } from "react";
import { FaCheck } from "react-icons/fa"
import { subscriptions } from "../interfaces";
import { MdClose } from "react-icons/md";
import moment from 'moment';
import { useRouter } from "next/navigation";
import Image from 'next/image'

export default function Modal({ setShowModal, userId }: { setShowModal: Dispatch<SetStateAction<boolean>>, userId: number }) {
  const router = useRouter();

  const [plan, setPlan] = useState(1);
  const [thx, setThx] = useState('');
  const [disableBtn, setDisableBtn] = useState(false);

  const benefits = {
    premium: [
      'Check articles', 'Unlimited downloads', 'Unlimited uploads',
    ],
    basic: [
      'Check articles', 'Up to 50 downloads per month', 'Up to 20 uploads per month',
    ]
  }

  const subscribe = async (sub: string) => {
    setDisableBtn(true);
    const subscription = `${sub.toUpperCase()} ${plan === 1 ? 'MONTHLY' : 'ANNUAL'}`
    const date = plan === 1 ? moment().add(30, 'days') : moment().add(1, 'years');

    const response = await fetch(`/api/subuser`, {
      method: 'POST',
      body: JSON.stringify({
        id: userId,
        plan: subscription,
        renewal: date.format("YYYY-MM-DD HH:mm:ss")
      }),
    });
    // console.log('DOWNLOAD UP', response);

    if (response.ok) {
      setThx(sub.toLowerCase());
    } else {
      setDisableBtn(false);
    }
  }

  const redirect = () => {
    router.push('/');
    router.refresh();
  }

  return (
    <div className="fixed flex items-center justify-center top-0 right-0 left-0 bottom-0 backdrop-blur-[2px] z-20">
      <div className="flex flex-wrap gap-5 items-center justify-center my-8 mx-10 p-10 w-full bg-white rounded-lg shadow-lg bg-gradient-to-r from-cyan-300 to-purple-300 relative">
        {thx == '' &&
          <>
            <span className="absolute top-3 right-3 text-2xl cursor-pointer" onClick={() => setShowModal(false)}><MdClose /></span>
            <div className="flex grow gap-7 justify-center">
              <span className={`text-center my-2 block rounded-lg shadow-lg px-7 pt-4 pb-3.5 text-md uppercase leading-tight cursor-pointer w-1/5 ${plan == 1 ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-navy hover:text-white'}`} onClick={() => setPlan(1)}>Monthly</span>
              <span className={`text-center my-2 block rounded-lg shadow-lg px-7 pt-4 pb-3.5 text-md uppercase leading-tight cursor-pointer w-1/5 ${plan == 2 ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-navy hover:text-white'}`} onClick={() => setPlan(2)}>Annual</span>
            </div>
            <div className="flex gap-7 w-full items-center justify-center h-3/4">
              <div className="flex flex-col h-full p-5 grow max-w-[35%] bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl text-center -m-5 p-5 mb-5 bg-navy text-white rounded-lg">Basic</h2>
                <div className="flex items-center justify-center rounded-lg h-16 text-navy text-4xl">
                  ${plan == 1 ? subscriptions[0].price : subscriptions[1].price}
                </div>
                <div className="flex flex-col p-3 mt-5 grow border border-gray-400 rounded-lg">
                  {benefits.basic.map((b, i) =>
                    <div key={i} className="py-3 text-navy text-xl flex items-center pl-4 gap-2">
                      <FaCheck /> {b}
                    </div>
                  )}
                </div>
                <button
                  className="text-3xl text-center -m-5 p-5 mt-5 bg-navy text-white rounded-lg hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => subscribe('BASIC')}
                  disabled={disableBtn}
                >Subscribe</button>
              </div>
              <div className="flex flex-col h-full p-5 grow max-w-[35%] bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl text-center -m-5 p-5 mb-5 bg-navy text-white rounded-lg">Premium</h2>
                <div className="flex items-center justify-center rounded-lg h-16 text-navy text-4xl">
                  ${plan == 1 ? subscriptions[2].price : subscriptions[3].price}
                </div>
                <div className="flex flex-col p-3 mt-5 grow border border-gray-400 rounded-lg">
                  {benefits.premium.map((b, i) =>
                    <div key={i} className="py-3 text-navy text-xl flex items-center pl-4 gap-2">
                      <FaCheck /> {b}
                    </div>
                  )}
                </div>
                <button
                  className="text-3xl text-center -m-5 p-5 mt-5 bg-navy text-white rounded-lg hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => subscribe('PREMIUM')}
                  disabled={disableBtn}
                >Subscribe</button>
              </div>
            </div>
          </>
        }
        {thx !== '' &&
          <>
            <span className="absolute top-3 right-3 text-2xl cursor-pointer" onClick={redirect}><MdClose /></span>
            <div className="flex grow gap-7 justify-center">
              <div className="text-navy text-4xl">Thank you!</div>
            </div>
            <div>
            </div>
            <div className="flex gap-7 w-full items-center justify-center h-3/4">
              <div className="flex flex-col h-full p-5 grow max-w-[35%] bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl text-center -m-5 p-5 mb-5 bg-navy text-white rounded-lg">You are now subscribed! {thx}</h2>
                <div className="mx-auto">
                  {/* <Image
                    className="relative"
                    src={''}
                    alt={``}
                    width={75}
                    height={75}
                  /> */}
                </div>
                <div className="flex flex-col p-3 mt-5 grow border border-gray-400 rounded-lg">
                  {benefits.basic.map((b, i) =>
                    <div key={i} className="py-3 text-navy text-xl flex items-center pl-4 gap-2">
                      <FaCheck /> {b}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        }
      </div>
    </div>
  )
}