import { describe, expect, test } from "bun:test"
import chipRawEasy from "./assets/C393941.raweasy.json"
import { EasyEdaJsonSchema } from "lib/schemas/easy-eda-json-schema"
import { getCadModelOffsetMmFromBounds } from "lib/websafe/get-easyeda-cad-placement-helpers"

describe("getCadModelOffsetMmFromBounds", () => {
  test("derives XY placement from explicit bounds even when _objMetadata is missing", () => {
    const withMetadata = EasyEdaJsonSchema.parse(chipRawEasy)
    const bounds = withMetadata._objMetadata?.bounds

    if (!bounds) {
      throw new Error("Expected fixture to include _objMetadata.bounds")
    }

    const withoutMetadata = structuredClone(withMetadata)
    delete withoutMetadata._objMetadata

    const offset = getCadModelOffsetMmFromBounds(withoutMetadata, bounds)

    expect(offset).not.toBeNull()
    expect(offset?.x).toBeCloseTo(0.00005079999998724816, 12)
    expect(offset?.y).toBeCloseTo(2.444001399999972, 12)
  })
})
