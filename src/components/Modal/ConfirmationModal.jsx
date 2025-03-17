import { Button, Modal } from "flowbite-react";
import { useState, useEffect } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function ConfirmationModalComponent({ openModal, callbackAction }) {
    const [show, setShow] = useState(openModal);

    useEffect(() => {
        setShow(openModal);
    }, [openModal])

    const submitHandler = () => {
        setShow(false);
        callbackAction(true);
    };

    const closeHandler = () => {
        setShow(false);
        callbackAction(false);
    };

    return (
        <>
            <Modal show={show} size="md" onClose={closeHandler} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this product?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={submitHandler}>
                                {"Yes, I'm sure"}
                            </Button>
                            <Button color="gray" onClick={closeHandler}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}