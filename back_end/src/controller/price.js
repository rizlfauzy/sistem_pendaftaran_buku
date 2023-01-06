import axios from "axios";
import sequelize from "../database";

require('dotenv').config()
const { CURRENCY_SECKRET_KEY } = process.env;

const price = {};

price.get_currency = async (req, res) => {
  try {
    const { currency, exclude } = req.query;
    const [select_currency] = await sequelize.query(`SELECT id,name,code FROM currency WHERE code <> '${exclude}' AND code LIKE '%${currency}%' OR name LIKE '%${currency}%'`);
    return res.status(200).json({ message: "Mata uang berhasil didapatkan", error: false, data: select_currency });
  } catch (e) {
    return res.status(500).json({ message: e.message, error: true });
  }
};

price.calculate_currency = async (req, res) => {
  try {
    const { to, from, amount } = req.query
    if (!to) return res.status(400).json({ message: "Mata uang akhir tidak boleh kosong", error: true });
    if (!from) return res.status(400).json({ message: "Mata uang awal tidak boleh kosong",error:true });
    if (!amount) return res.status(400).json({ message: "Uang tidak boleh kosong", error: true });
    const { data } = await axios({
      url: `https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${amount}`,
      method: "GET",
      headers: {
        apikey: CURRENCY_SECKRET_KEY,
      },
    });
    return res.status(200).json({message:"Mata uang berhasil diubah",error:false,data})
  } catch (e) {
    return res.status(500).json({ message: e.message, error: true });
  }
}

export default price;
