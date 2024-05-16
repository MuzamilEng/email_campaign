import { Icon } from "@iconify/react";
import { useRef } from "react";
export const FileUpload = ({ handleFile }) => {
  const hiddenFileInput = useRef(null);
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    handleFile(fileUploaded);
  };
  return (
    <main className="w-full mt-[0.5vw]">
   <section onClick={handleClick} className="w-full md:max-w-[10vw] hover:bg-blue-800 text-white flex items-end justify-center mt-[0.7vw] bg-blue-700 focus:outline-none rounded-[0.5vw] p-[0.7vw]">
    <Icon icon="uil:file-alt" className='text-[4.5vw] md:text-[1.5vw] cursor-pointer hover:scale-125' />
    <p className="text-[1vw]">Upload File</p>
      <input
        type="file" accept=".csv"
        onChange={handleChange}
        ref={hiddenFileInput}
        style={{ display: "none" }}
      />
    </section>
    </main>
  );
};
