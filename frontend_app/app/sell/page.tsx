"use client"

import { useContractWrite, usePrepareContractWrite } from "wagmi";
import marketAbi from '@/public/market.json'
import { useState } from "react";
const SellProduct = () => {

    const [productName,setProductName] = useState("")
    const [description,setDescription] = useState("")
    const [productImage,setProductImage] = useState("")
    const [price,setPrice] = useState(0)


    const { config } = usePrepareContractWrite({
        address: `0x${process.env.NEXT_PUBLIC_MARKET_ADDRESS}`,
        abi: marketAbi,
        functionName: 'addProduct',
        args: [productName,description,productImage,price],
    });
    const { data, isLoading, isSuccess, write, error  } = useContractWrite(config);

    const deployProduct = async () => {
        write && write()
    }

    return (
        <div className="bg-white py-6 sm:py-8 lg:py-12">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                <div className="mb-10 md:mb-16">
                    <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">Start to Sell</h2>
                </div>

                <div className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label htmlFor="productName" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Product Name</label>
                        <input name="productName" value={productName} onChange={(event)=>setProductName(event.target.value)} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="price" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Price*</label>
                        <input name="price" value={price} onChange={(event)=>setPrice(Number(event.target.value))} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="price" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Image URL*</label>
                        <input name="price" value={productImage} onChange={(event)=>setProductImage(event.target.value)} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="explanation" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Explanation*</label>
                        <textarea name="explanation" value={description} onChange={(event)=>setDescription(event.target.value)}  className="h-64 w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"></textarea>
                    </div>

                    <div className="flex items-center justify-between sm:col-span-2">
                        <button onClick={() => deployProduct()} className="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base">Sell</button>

                        <span className="text-sm text-gray-500">*Required</span>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default SellProduct;