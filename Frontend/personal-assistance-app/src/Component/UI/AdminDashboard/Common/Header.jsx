const Header = ({ title }) => {
  return (
    <header className="bg-gray-800 bg-opacity-50 w-[1080px]  backdrop-blur-md shadow-lg border-b border-indigo-700">
      <div className="w-full  py-4 px-4 sm:px-6 lg:px-8 ">
        <h1 className="text-2xl font-semibold text-gray-100">{title}</h1>
      </div>
    </header>
  );
};
export default Header;
