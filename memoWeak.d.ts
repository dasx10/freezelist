export default function memoWeak<Call extends (value: any) => any>(call: Call): Call;
