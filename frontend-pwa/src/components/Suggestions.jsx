import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import LoadingDots from "./LoadingAnimation";


export default function Suggestions() {
    const token = localStorage.getItem("authToken");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);  
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchSuggestions();
    }, [page, pageSize])

    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/suggestions?token=${token}&page=${page}&page_size=${pageSize}`);
            console.log(res);
            if (!res.ok) {
                if (res.status === 401) {
                    navigate("/login");
                }
                throw new Error("Failed to fetch suggestions");
            }

            const resData = await res.json();
            setSuggestions(resData.data);
            setTotal(resData.total);
            setPage(resData.page);
            setPageSize(resData.page_size);
        } catch (err) {
            console.error("Error fetching suggestions:", err);
        } finally {
            setLoading(false);
        }
    }

    const handleNextPage = () => {
        if (page * pageSize >= total) return;
        setPage(page + 1);

    }
    const handlePreviousPage = () => {
        if (page == 1) return;
        setPage(page - 1);
    }


    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <LoadingDots />
            </div>
        )
       
    }


    return (
        <div className="w-full max-w-3xl mx-auto mt-10">
            <h3 className="text-2xl font-bold">Suggestions</h3>
        
            {!loading && suggestions.length === 0? (
                <p>No suggestions yet.</p>
            ) : (
                suggestions.map((suggestion) => (
                    <div key={suggestion?.id} className="w-full flex justify-between   border-b border-gray-300 pt-4">
                        <div className="flex flex-col items-start min-w-0">
                            <p className="font-bold text-[24px] ">{suggestion?.title}</p>
                            <p className="font-medium w-full text-left  wrap-break-word">{suggestion?.message}</p>
                            <p className="text-gray-500 text-xs ">{suggestion?.created_at}</p>
                        </div>
                        {/* <div className="flex items-center ">
                            <MdOutlineDeleteOutline
                                size={24}
                                className="cursor-pointer text-red-500 ml-4"
                                onClick={()=>{}}
                            />
                        </div> */}


                    </div>
                ))
            )}
            {/* pagination */}
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 ">
                <div className="flex items-center bg-white/90 backdrop-blur-md shadow-xl rounded-full border border-gray-200">
                    <button
                        className=" 
                        px-4 py-2   bg-white cursor-pointer text-gray-800 border-r  
                         shadow-gray-500 rounded-l-full disabled:cursor-not-allowed
                         transition-transform duration-150 ease-out active:scale-95
                         "
                        onClick={handlePreviousPage}
                        disabled={page == 1}
                    >
                        <GrLinkPrevious size={20} />
                    </button>

                    <button
                        className="
                        px-4 py-2 bg-white cursor-pointer   text-gray-800  shadow-gray-500 
                        rounded-r-full disabled:cursor-not-allowed
                        transition-transform duration-150 ease-out active:scale-95
                        "
                        onClick={handleNextPage}
                        disabled={page * pageSize >= total}
                    >
                        <GrLinkNext size={20} />
                    </button>

                </div>


            </div>

        </div>

    )
}