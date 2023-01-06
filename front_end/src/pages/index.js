import React, { useEffect,useLayoutEffect } from "react";

import Title from "../layouts/title";
import Navbar from "../layouts/navbar";
import HomePage from "../layouts/homepage";
import Footer from "../layouts/footer";

import useAsync from "../helpers/hooks/useAsync";
import useSession from "../helpers/hooks/useSession";

import get_data from "../helpers/fetch/get_data";
import { running_animate } from "../helpers/formatting/animation";

export default function Index({ title }) {
  const { data, run, isLoading } = useAsync();
  const { session } = useSession();

  useEffect(() => {
    run(get_data({ url: "/user", token: session }));
  }, [])

  useLayoutEffect(running_animate,[])

  return (
    <>
      <Title>{title} | Rak Buku</Title>
      <Navbar data={data} isLoading={isLoading} />
      <section id="index_page" className="pt-36 pb-36">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap">
            <HomePage data_user={data} isLoading_user={isLoading} />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
