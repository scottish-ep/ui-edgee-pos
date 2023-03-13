interface EntityInfoProps {
  header?: string;
  content?: string;
  image?: string;
  onClick?: () => void;
}

const EntityInfo = (props: EntityInfoProps) => {
  const { header, onClick, content, image } = props;
  return (
    <div
      className="flex items-center justify-start gap-4 cursor-pointer"
      onClick={onClick}
    >
      {image && (
        <img src={image} className="rounded h-[50px] w-[50px] object-contain" />
      )}
      <div>
        <div className="flex-1 text-[#191424] text-base font-bold">
          {header}
        </div>
        <div className="text-[#718096]">{content}</div>
      </div>
    </div>
  );
};

export default EntityInfo;
