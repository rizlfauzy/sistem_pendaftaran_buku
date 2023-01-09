import React,{useEffect,useLayoutEffect} from 'react'

import Title from '../layouts/title'
import Navbar from '../layouts/navbar'
import NotFoundPage from '../layouts/not_found_page'
import Footer from '../layouts/footer'

import useAsync from '../helpers/hooks/useAsync'
import useSession from '../helpers/hooks/useSession'

import get_data from '../helpers/fetch/get_data'
import { running_animate } from '../helpers/formatting/animation'

export default function NotFound() {
  const { data, run, isLoading } = useAsync();
  const { session } = useSession();

  useEffect(() => {
    run(get_data({ url: "/user", token: session }));
  }, [run, session]);
  useLayoutEffect(running_animate,[])
  return (
    <>
      <Title>404 | Rak Buku</Title>
      <Navbar data={data} isLoading={isLoading} />
      <section id="404_page" className="pt-36 pb-36">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap">
            <NotFoundPage />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
