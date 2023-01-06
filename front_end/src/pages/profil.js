import React,{useEffect,useState,useLayoutEffect} from 'react'

import Title from '../layouts/title'
import Navbar from '../layouts/navbar'
import Footer from '../layouts/footer'
import ProfilPage from '../layouts/profil_page'

import useAsync from '../helpers/hooks/useAsync'
import useSession from '../helpers/hooks/useSession'

import get_data from '../helpers/fetch/get_data';
import { running_animate } from '../helpers/formatting/animation'

export default function Profil() {
  const [is_update_photo, set_is_update_photo] = useState(false);
  const [is_update_profil, set_is_update_profil] = useState(false);

  const { data, run, isLoading } = useAsync();
  const { session } = useSession();

  useEffect(() => {
    run(get_data({ url: "/user", token: session }));
    set_is_update_photo(false)
    set_is_update_profil(false);
  }, [run, session, is_update_photo, is_update_profil]);

  useLayoutEffect(running_animate,[])

  return (
    <>
      <Title>Profil | Rak Buku</Title>
      <Navbar data={data} isLoading={isLoading} />
      <section id="profil_page" className="pt-36 pb-36">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap">
            <ProfilPage data_user={data} isLoading_user={isLoading} set_is_update_photo={set_is_update_photo} set_is_update_profil={set_is_update_profil} is_update_profil={is_update_profil} />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
