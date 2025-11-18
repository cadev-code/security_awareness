const links = [
  {
    href: 'https://www.welivesecurity.com/en/business-security/',
    src: '/images/antivirus-information.gif',
  },
  {
    href: 'https://www.watchguard.com/es',
    src: '/images/firewall-information.gif',
  },
  {
    href: 'https://directotelecom.mx/',
    src: '/images/news-information.gif',
  },
];

export const Information = () => {
  return (
    <div className="h-full flex flex-col items-center bg-[#00092e] justify-center p-8">
      <img
        className="max-h-[60vh]"
        src="/images/information-fondo.gif"
        draggable="false"
      />
      <div className="h-[30vh] flex w-full justify-around relative">
        {links.map(({ href, src }) => (
          <a
            className="transition-transform hover:scale-108"
            href={href}
            target="_blank"
          >
            <img className="h-full" src={src} draggable="false" />
          </a>
        ))}
      </div>
    </div>
  );
};
