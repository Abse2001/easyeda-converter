import { it, expect } from "bun:test"
import atmegaRawEasy from "../assets/C14877.raweasy.json"
import { convertBetterEasyToTsx } from "lib/websafe/convert-to-typescript-component"
import { EasyEdaJsonSchema } from "lib/schemas/easy-eda-json-schema"
import { convertEasyEdaJsonToCircuitJson } from "lib"
import { runTscircuitCode } from "tscircuit"

it("should convert atmega328p into typescript file", async () => {
  const betterEasy = EasyEdaJsonSchema.parse(atmegaRawEasy)
  const result = await convertBetterEasyToTsx({
    betterEasy,
  })

  expect(result).not.toContain("milmm")
  expect(result).not.toContain("NaNmm")

  const circuitJson = await runTscircuitCode(result)
  const circuitJsonWithBoard = circuitJson.concat([
    {
      type: "pcb_board",
      center: { x: 0, y: 0 },
      width: 20,
      height: 20,
      pcb_board_id: "main_board",
      thickness: 1.6,
      num_layers: 2,
      material: "fr4",
    },
  ])
  await expect(circuitJsonWithBoard).toMatch3dSnapshot(import.meta.path)
}, 20000)
