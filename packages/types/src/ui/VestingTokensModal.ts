interface VestingInfoResponse {
  balance: bigint;
  index: bigint;
  recipient: string;
  schedule: Curve;
}

/**
 * Curve types
 */
type Curve =
  | { tag: "Constant"; values: readonly [bigint] }
  | { tag: "SaturatingLinear"; values: readonly [SaturatingLinear] }
  | { tag: "PiecewiseLinear"; values: readonly [PiecewiseLinear] };

/**
 * Saturating Linear
 * $$f(x)=\begin{cases}
 * [min(y) * amount],  & \text{if x <= $x_1$ } \\\\
 * [y * amount],  & \text{if $x_1$ >= x <= $x_2$ } \\\\
 * [max(y) * amount],  & \text{if x >= $x_2$ }
 * \end{cases}$$
 *
 * min_y for all x <= min_x, max_y for all x >= max_x, linear in between
 */
interface SaturatingLinear {
  /**
   * time when curve has fully saturated
   */
  max_x: bigint;
  /**
   * max value at saturated time
   */
  max_y: bigint;
  /**
   * time when curve start
   */
  min_x: bigint;
  /**
   * min value at start time
   */
  min_y: bigint;
}

/**
 * This is a generalization of SaturatingLinear, steps must be arranged with increasing time [`u64`].
 * Any point before first step gets the first value, after last step the last value.
 * Otherwise, it is a linear interpolation between the two closest points.
 * Vec of length 1 -> [`Constant`](Curve::Constant) .
 * Vec of length 2 -> [`SaturatingLinear`] .
 */
interface Step {
  time: bigint;
  value: bigint;
}

interface PiecewiseLinear {
  /**
   * steps
   */
  steps: Array<Step>;
}

export interface VestingTokensModalProps {
  open: boolean;
  onClose: () => void;
  vestingInfo: VestingInfoResponse[];
  queryAvailableToClaim: (index: bigint) => Promise<bigint>;
  claim: (index: bigint) => Promise<void>;
}
