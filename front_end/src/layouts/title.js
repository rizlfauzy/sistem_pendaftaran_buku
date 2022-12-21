import { Helmet, HelmetProvider } from "react-helmet-async";
import React from "react";

export default function Title({ children }) {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{children}</title>
      </Helmet>
    </HelmetProvider>
  );
}
