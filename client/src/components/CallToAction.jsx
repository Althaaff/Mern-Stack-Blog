import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center mt-5">
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-2xl">
          Want to learn more about{" "}
          <span className="text-red-500">javascript</span>?
        </h2>

        <p className="text-gray-500 my-2">
          Checkout these rescources with 100 Days of Frontend
        </p>

        <Button
          gradientDuoTone="purpleToPink"
          className="rounded-tl-xl rounded-bl-none rounded-tr-none"
        >
          <a
            href="https://codedamn.com/challenge/100-days-of-frontend"
            target="_blank"
            rel="noopener noreferer"
          >
            100 Days Of Frontend
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img
          className="rounded"
          src="https://res.cloudinary.com/dbr73rpz9/image/upload/v1688631686/images/1_YQgaKfVzK-YpxyT3NYqJAg_zcvpgb.png"
        />
      </div>
    </div>
  );
}
