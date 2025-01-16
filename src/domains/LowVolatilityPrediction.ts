export default interface LowVolatilityPrediction {
  predicted_at: string
  prediction: number
  mean: number
  score: number
  low_volatility_signal: boolean
  previous_low_volatility_signal: boolean
}