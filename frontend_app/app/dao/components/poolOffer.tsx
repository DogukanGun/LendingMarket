"use client"
import daoAbi from '@/public/dao.json'
import { PoolOffer } from '@/type/poolOffer';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';

const PoolOffer = () => {

    const [poolOffer, setPoolOffer] = useState<PoolOffer>()
    const [isApproved,setIsApprove] = useState<boolean | null>(null)

    useContractRead({
        address: `0x${process.env.NEXT_PUBLIC_DAO_ADDRESS}`,
        abi: daoAbi,
        functionName: 'poolOffer',
        args: [],
        enabled: true,
        onSuccess(data: any[]) {
            setPoolOffer({
                poolName: data[0],
                tokenAddress: data[1],
                timestamp: data[2],
                offerOwner: data[3]
            })
        },
    });

    const { config } = usePrepareContractWrite({
        address: `0x${process.env.NEXT_PUBLIC_DAO_ADDRESS}`,
        abi: daoAbi,
        functionName: 'vote',
        args: [isApproved],
    });
    const { write } = useContractWrite(config);
    

    useEffect(()=>{
        isApproved !== null && write && write()
    },[isApproved])


    return (
        <div className="w-1/3 text-center mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-700 dark:border-gray-700">
            {poolOffer?.poolName !== "" ?
                (
                    <>
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Pool Name : {poolOffer?.poolName}</h5>
                        <a className="pb-3 mt-3 font-normal text-blue-400 dark:text-blue-400" href={`https://pegasus.lightlink.io/token/${poolOffer?.tokenAddress}`}>Token Address: {poolOffer?.tokenAddress} </a>
                        <hr />
                        <a className="mb-3 mt-3 font-normal text-blue-400 dark:text-blue-400" href={`https://pegasus.lightlink.io/address/${poolOffer?.offerOwner}`}>Offer Owner: {poolOffer?.offerOwner}</a>


                        <div className="inline-flex rounded-md shadow-sm mt-10 " role="group">
                            <button type="button" onClick={()=>setIsApprove(true)} className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-white rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
                                Vote for Accept
                            </button>
                            <button type="button" onClick={()=>setIsApprove(false)} className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
                                Vote for Reject
                            </button>
                        </div>

                    </>
                ) :
                <>
                    <Link href="/dao/offer" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Make an Offer
                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                        </svg>
                    </Link>
                </>}
        </div>
    )

}


export default PoolOffer;