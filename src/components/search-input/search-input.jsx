import { useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Button, TextInput } from "flowbite-react";
import classes from './search-input.module.scss';

export default function SearchInputComponent({ callbackFn }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const searchCallerIdHandler = async () => {
        callbackFn(searchTerm);
    }

    return <div className={classes.btnSection}>
        <TextInput id="name_search" onChange={handleInputChange} placeholder="Search By Name" />
        <Button  color="gray" onClick={searchCallerIdHandler}>
            <HiOutlineSearch className="h-4 w-4" />
        </Button>
    </div>
}