import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="flex flex-wrap">
        <div className="lg:w-1/2 w-full">
          <div className="footer_content">
            <div className="footer_title">Details</div>
            <div className="footer_body">
              <ul>
                <li>
                  <i className="bi bi-bookmark-fill mr-5"></i>
                  <span>Universitas Indraprasta (UNINDRA)</span>
                </li>
                <li>
                  <i className="bi bi-card-list mr-5"></i>
                  <span>Tugas Sistem Informasi (Kelompok 8)</span>
                </li>
                <li>
                  <i className="bi bi-geo-alt-fill mr-5"></i>
                  <span>TB. Simatupang, Jl. Nangka Raya No.58 C, RW.5, Tj. Bar., Kec. Jagakarsa, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12530</span>
                </li>
                <li>
                  <i className="bi bi-telephone-fill mr-5"></i>
                  <span>0851-5656-8650</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 w-full">
          <div className="footer_content">
            <div className="footer_title">Anggota</div>
            <div className="footer_body">
              <ul>
                <li>
                  <i className="bi bi-1-square-fill mr-5"></i>
                  <span>Rizal Fauzi</span>
                </li>
                <li>
                  <i className="bi bi-2-square-fill mr-5"></i>
                  <span>Rizky Liandika</span>
                </li>
                <li>
                  <i className="bi bi-3-square-fill mr-5"></i>
                  <span>Lubab Koit Durohman</span>
                </li>
                <li>
                  <i className="bi bi-4-square-fill mr-5"></i>
                  <span>Renaldi Alifio Putra</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="w-full">
          <div className="strip_text">
            <span>Hak Cipta</span>
          </div>
          <div className="footer_content mt-7">
            <div className="footer_body text-center">
              <i className="bi bi-c-circle-fill mr-5"></i>
              <span>Copyright {new Date().getFullYear()} | made with love by Kelompok 8</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
