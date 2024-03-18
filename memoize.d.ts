export default function memoize<Call extends (value: any) => any>(call: Call): Call;
