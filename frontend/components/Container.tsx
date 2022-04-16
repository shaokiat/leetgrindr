type Props = {
  children?: React.ReactNode;
};

const Container: React.FC<Props> = ({ children }) => {
  return (
    <div className="bg-slate-800 min-h-screen min-w-screen z-50 text-white">
      {children}
    </div>
  );
};

export default Container;
