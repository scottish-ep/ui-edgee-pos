import Image from 'next/image';
import { Switch } from 'antd';
import TitlePage from 'components/TitlePage/Titlepage';
import { isArray } from 'utils/utils';
import styles from 'styles/TransportCompany.module.css';

const TransportCompany = () => {
  const transportCompanyList = Array(4)
    .fill({
      image: require('../../../public/viettel-post.png'),
      name: 'Viettel Post',
    })
    .map((item, index) => ({ ...item, id: index++ }));

  return (
    <div className="w-full flex flex-col h-screen">
      <TitlePage title="Đơn vị vận tải" description="Đơn vị vận tải" />
      <div className=" mt-[24px] w-full flex flex-wrap  gap-[20px]">
        {isArray(transportCompanyList) &&
          transportCompanyList.map((item) => {
            return (
              <div key={item.id} className={styles.company_wrapper}>
                <Image width={32} height={32} alt="company" src={item.image} />
                <div className={styles.content}>
                  <span className="text-base font-medium">{item.name}</span>
                  <span className="text-[#969BA8] text-[12px]">
                    <a href="https://quanlyhethong-staging.tienichlinhduong.com/transport-company/users/5">
                      Set up account
                    </a>
                  </span>
                </div>
                <Switch className='translate-y-[10px]'/>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default TransportCompany;
