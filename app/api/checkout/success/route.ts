
import { NextResponse } from "next/server";

const sdkModulo = require('sdk-node-payway');

const publicKey = process.env.PAYWAY_PUBLIC_KEY;
const privateKey = process.env.PAYWAY_PRIVATE_KEY;
const ambient = process.env.PAYWAY_AMBIENT; // "developer" o "production"
const company = "Uzcudun Coffee Ride";
const user = "RAMIRO UZCUDUN";

// Inicialización única del SDK [7]
export const paywayClient = new sdkModulo.sdk(ambient, publicKey, privateKey, company, user);

export async function GET() {
  console.log('Checkout Success API called');
  console.log(paywayClient)
  try {
    const transactionId = "eyJkYXRlIjoiMjAyNi0wMS0wMVQyMDo0MFoiLCJiaW4iOiI0NTA3OTkiLCJmaXJzdF9pbnN0YWxsbWVudF9leHBpcmF0aW9uX2RhdGUiOm51bGwsImNvbmZpcm1lZCI6bnVsbCwiZXN0YWJsaXNobWVudF9uYW1lIjpudWxsLCJpbnN0YWxsbWVudHMiOjEsImFnZ3JlZ2F0ZV9kYXRhIjpudWxsLCJjYXJkX2JyYW5kIjoiVmlzYSIsInNpdGVfdHJhbnNhY3Rpb25faWQiOiJDSDAxMDEyMDI2MzE0YSIsImN1cnJlbmN5IjoiYXJzIiwiaWQiOjE1Mjk0ODkzLCJwYW4iOiI1MDU0MjVmMTViMmM3YzQ1ODRjMTczNzRhMjIxNzkyZGQ0Iiwic3RhdHVzX2RldGFpbHMiOnsidGlja2V0IjoiNjY5NyIsImFkZHJlc3NfdmFsaWRhdGlvbl9jb2RlIjoiVlRFMjIyMiIsImVycm9yIjpudWxsLCJjYXJkX2F1dGhvcml6YXRpb25fY29kZSI6IkIwOTExMCJ9LCJhbW91bnQiOjUwMDAsInBheW1lbnRfbW9kZSI6bnVsbCwiY2FyZF9kYXRhIjoiL3Rva2Vucy8xNTI5NDg5MyIsImF1dGhlbnRpY2F0ZWRfdG9rZW4iOm51bGwsImZyYXVkX2RldGVjdGlvbiI6eyJzdGF0dXMiOm51bGx9LCJ0b2tlbiI6IjY0NGFlNGZkLTNjZDAtNDk1NC05MTc4LWE3OGIyMTNiMzE0YSIsInBheW1lbnRfbWV0aG9kX2lkIjoxLCJwYXltZW50X3R5cGUiOiJzaW5nbGUiLCJzdWJfcGF5bWVudHMiOltdLCJzaXRlX2lkIjoiODg4ODg4ODgiLCJzcHYiOm51bGwsImN1c3RvbWVyX3Rva2VuIjpudWxsLCJzdGF0dXMiOiJhcHByb3ZlZCIsImN1c3RvbWVyIjpudWxsfQ"; // El ID que enviaste originalmente
    new Promise((resolve, reject) => {
      paywayClient.paymentInfo(8, (result: any, err: any) => {
        if (err) {
          console.error("Error al consultar:", err);
          reject(err);
        } else {
          console.log("Resultado de la consulta de pago:", result);
          resolve(result);
        }
      });
    });

    // 'response' contendrá el JSON con 'products', 'amount', etc.
    console.log("D---- fin de consulta de pago");
  } catch (error) {
    console.error("Error al consultar:", error);
  }
  return NextResponse.json({ message: 'Checkout Success API is working' });
}

/** Inicia un proceso de pago en Payway y obtiene el enlace de pago [8] */