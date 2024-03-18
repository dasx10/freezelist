export default function memoizeWeak<Call extends (value: any) => any>(call: Call): Call;
