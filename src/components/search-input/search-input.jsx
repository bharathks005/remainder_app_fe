import { useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { TextInput } from "flowbite-react";

export default function SearchInputComponent({callbackFn}) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleInputBlur = async (e) => {
        if (!searchTerm.trim().length) {
            callbackFn();
        }
    }

    const searchCallerIdHandler = async (e) => {
        if (e.key === "Enter" || e.keyCode === 13) {            
            e.preventDefault();
            if (searchTerm.trim().length) {
                callbackFn(searchTerm);
            }            
        }
    }
    return  <TextInput id="name_search" icon={HiOutlineSearch} onChange={handleInputChange} onBlur={handleInputBlur} onKeyDown={searchCallerIdHandler} placeholder="Search By Name" />
}