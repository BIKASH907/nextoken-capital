// pages/api/kyc/token.js
// Generates a Sumsub access token for the Web SDK
// Called by the /kyc page to initialize the Sumsub widget

import crypto from "crypto";
const { getSession } = require("../../../lib/session");
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";


const SUMSUB_APP_TOKEN  = process.env.SUMSUB_APP_TOKEN;
const SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY;

const alpha2to3={AF:"AFG",AL:"ALB",DZ:"DZA",AD:"AND",AO:"AGO",AG:"ATG",AR:"ARG",AM:"ARM",AU:"AUS",AT:"AUT",AZ:"AZE",BS:"BHS",BH:"BHR",BD:"BGD",BB:"BRB",BY:"BLR",BE:"BEL",BZ:"BLZ",BJ:"BEN",BT:"BTN",BO:"BOL",BA:"BIH",BW:"BWA",BR:"BRA",BN:"BRN",BG:"BGR",BF:"BFA",BI:"BDI",CV:"CPV",KH:"KHM",CM:"CMR",CA:"CAN",CF:"CAF",TD:"TCD",CL:"CHL",CN:"CHN",CO:"COL",KM:"COM",CG:"COG",CD:"COD",CR:"CRI",CI:"CIV",HR:"HRV",CU:"CUB",CY:"CYP",CZ:"CZE",DK:"DNK",DJ:"DJI",DM:"DMA",DO:"DOM",EC:"ECU",EG:"EGY",SV:"SLV",GQ:"GNQ",ER:"ERI",EE:"EST",SZ:"SWZ",ET:"ETH",FJ:"FJI",FI:"FIN",FR:"FRA",GA:"GAB",GM:"GMB",GE:"GEO",DE:"DEU",GH:"GHA",GR:"GRC",GD:"GRD",GT:"GTM",GN:"GIN",GW:"GNB",GY:"GUY",HT:"HTI",HN:"HND",HK:"HKG",HU:"HUN",IS:"ISL",IN:"IND",ID:"IDN",IR:"IRN",IQ:"IRQ",IE:"IRL",IL:"ISR",IT:"ITA",JM:"JAM",JP:"JPN",JO:"JOR",KZ:"KAZ",KE:"KEN",KI:"KIR",KP:"PRK",KR:"KOR",KW:"KWT",KG:"KGZ",LA:"LAO",LV:"LVA",LB:"LBN",LS:"LSO",LR:"LBR",LY:"LBY",LI:"LIE",LT:"LTU",LU:"LUX",MO:"MAC",MG:"MDG",MW:"MWI",MY:"MYS",MV:"MDV",ML:"MLI",MT:"MLT",MH:"MHL",MR:"MRT",MU:"MUS",MX:"MEX",FM:"FSM",MD:"MDA",MC:"MCO",MN:"MNG",ME:"MNE",MA:"MAR",MZ:"MOZ",MM:"MMR",NA:"NAM",NR:"NRU",NP:"NPL",NL:"NLD",NZ:"NZL",NI:"NIC",NE:"NER",NG:"NGA",MK:"MKD",NO:"NOR",OM:"OMN",PK:"PAK",PW:"PLW",PS:"PSE",PA:"PAN",PG:"PNG",PY:"PRY",PE:"PER",PH:"PHL",PL:"POL",PT:"PRT",QA:"QAT",RO:"ROU",RU:"RUS",RW:"RWA",KN:"KNA",LC:"LCA",VC:"VCT",WS:"WSM",SM:"SMR",ST:"STP",SA:"SAU",SN:"SEN",RS:"SRB",SC:"SYC",SL:"SLE",SG:"SGP",SK:"SVK",SI:"SVN",SB:"SLB",SO:"SOM",ZA:"ZAF",SS:"SSD",ES:"ESP",LK:"LKA",SD:"SDN",SR:"SUR",SE:"SWE",CH:"CHE",SY:"SYR",TW:"TWN",TJ:"TJK",TZ:"TZA",TH:"THA",TL:"TLS",TG:"TGO",TO:"TON",TT:"TTO",TN:"TUN",TR:"TUR",TM:"TKM",TV:"TUV",UG:"UGA",UA:"UKR",AE:"ARE",GB:"GBR",US:"USA",UY:"URY",UZ:"UZB",VU:"VUT",VA:"VAT",VE:"VEN",VN:"VNM",YE:"YEM",ZM:"ZMB",ZW:"ZWE"};
const SUMSUB_LEVEL_NAME = process.env.SUMSUB_LEVEL_NAME || "basic-kyc-level";
const SUMSUB_BASE_URL   = "https://api.sumsub.com";

// Generate HMAC-SHA256 signature required by Sumsub
function createSignature(ts, method, url, body) {
  const dataToSign = ts + method.toUpperCase() + url + (body ? JSON.stringify(body) : "");
  return crypto
    .createHmac("sha256", SUMSUB_SECRET_KEY)
    .update(dataToSign)
    .digest("hex");
}

async function sumsubRequest(method, url, body = null) {
  const ts = Math.floor(Date.now() / 1000).toString();
  const signature = createSignature(ts, method, url, body);

  const headers = {
    "Accept":           "application/json",
    "Content-Type":     "application/json",
    "X-App-Token":      SUMSUB_APP_TOKEN,
    "X-App-Access-Sig": signature,
    "X-App-Access-Ts":  ts,
  };

  const res = await fetch(SUMSUB_BASE_URL + url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.description || data.message || "Sumsub API error");
  return data;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Must be logged in
  const session = getSession(req);
  if (!session) return res.status(401).json({ error: "Not authenticated. Please log in first." });

  try {
    const userId = session.userId;

    // Get user from DB to use their email as externalUserId
    await connectDB();
  const user = await User.findById(session.userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    // Use userId as the external user ID in Sumsub
    const externalUserId = userId;

    // Create applicant in Sumsub (idempotent — safe to call multiple times)
    let applicantId = user.sumsubApplicantId;
    if (!applicantId) {
      const applicant = await sumsubRequest("POST", "/resources/applicants?levelName=" + SUMSUB_LEVEL_NAME, {
        externalUserId,
        email: user.email,
        fixedInfo: {
          firstName: user.firstName,
          lastName:  user.lastName,
          country:   alpha2to3[user.country] || user.country || undefined,
          dob:       user.dob || undefined,
        },
      });
      applicantId = applicant.id;

      // Save applicant ID to user record
      await User.findByIdAndUpdate(userId, { $set: { sumsubApplicantId: applicantId, updatedAt: new Date() } });
    }

    // Generate access token for the Web SDK
    const tokenData = await sumsubRequest(
      "POST",
      `/resources/accessTokens?userId=${externalUserId}&levelName=${SUMSUB_LEVEL_NAME}`
    );

    return res.status(200).json({
      token:       tokenData.token,
      userId:      externalUserId,
      applicantId,
      levelName:   SUMSUB_LEVEL_NAME,
    });
  } catch (e) {
    console.error("Sumsub token error:", e.message);
    return res.status(500).json({ error: "KYC service unavailable: " + e.message });
  }
}