// Copyright 2020 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as React from "react"
import * as renderer from "@testing-library/react"
import { withProviders } from "../../test-utils"
import "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event"
import { CampaignURLBuilder, URLBuilderType } from "./index"
import { GAVersion } from "../../constants"

// Capture original error global so it's easier to replace after a mock.
const originalError = console.error

// Increase the timeout for this test suite. The userEvent.type calls can
// be slow, and the default 5s timeout is not always enough.
jest.setTimeout(10000)
describe("for the Campaign URL Builder component", () => {
  beforeEach(() => {
    console.error = originalError
  })

  test("can render page without error", () => {
    const { wrapped } = withProviders(
      <CampaignURLBuilder
        version={GAVersion.UniversalAnalytics}
        type={URLBuilderType.Web}
      />
    )
    renderer.render(wrapped)
  })
  test("generates url for happy path inputs", async () => {
    const { wrapped } = withProviders(
      <CampaignURLBuilder
        version={GAVersion.UniversalAnalytics}
        type={URLBuilderType.Web}
      />
    )
    const { findByLabelText: find } = renderer.render(wrapped)
    // Enter happy path values
    await userEvent.type(await find(/website URL/), "https://example.com")
    await userEvent.type(await find(/campaign ID/), "abc.def")
    await userEvent.type(await find(/campaign source/), "google")
    await userEvent.type(await find(/campaign medium/), "cpc")
    await userEvent.type(await find(/campaign name/), "spring_sale")
    await userEvent.type(await find(/campaign term/), "running+shoes")
    await userEvent.type(await find(/campaign content/), "logolink")

    const input = await find(/generated URL/)

    expect(input).toHaveValue(
      "https://example.com?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale&utm_id=abc.def&utm_term=running%2Bshoes&utm_content=logolink"
    )
  })
  describe("entering a website url with existing", () => {
    test("fills all when provided", async () => {
      const { wrapped } = withProviders(
        <CampaignURLBuilder
          version={GAVersion.UniversalAnalytics}
          type={URLBuilderType.Web}
        />
      )
      const { findByLabelText: find } = renderer.render(wrapped)
      renderer.fireEvent.change(await find(/website URL/), {
        target: {
          value:
            "https://example.com?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale&utm_id=abc.def&utm_term=running%2Bshoes&utm_content=logolink",
        },
      })

      expect(await find(/campaign ID/)).toHaveValue("abc.def")
      expect(await find(/campaign source/)).toHaveValue("google")
      expect(await find(/campaign medium/)).toHaveValue("cpc")
      expect(await find(/campaign name/)).toHaveValue("spring_sale")
      expect(await find(/campaign term/)).toHaveValue("running+shoes")
      expect(await find(/campaign content/)).toHaveValue("logolink")
    })
  })
  describe("entering a no-no url shows a warning", () => {
    test("url: ga-dev-tools.web.app", async () => {
      const { wrapped } = withProviders(
        <CampaignURLBuilder
          version={GAVersion.UniversalAnalytics}
          type={URLBuilderType.Web}
        />
      )
      const { findByLabelText: find, findByTestId } = renderer.render(wrapped)
      await userEvent.type(
        await find(/website URL/),
        "https://ga-dev-tools.web.app"
      )

      const warningBanner = await findByTestId("bad-url-warnings")

      expect(warningBanner).toBeVisible()
    })
    test("url: play.google.com", async () => {
      const { wrapped } = withProviders(
        <CampaignURLBuilder
          version={GAVersion.UniversalAnalytics}
          type={URLBuilderType.Web}
        />
      )
      const { findByLabelText: find, findByTestId } = renderer.render(wrapped)
      await userEvent.type(await find(/website URL/), "https://play.google.com")

      const warningBanner = await findByTestId("bad-url-warnings")

      expect(warningBanner).toBeVisible()
    })
    test("url: itunes.apple.com", async () => {
      const { wrapped } = withProviders(
        <CampaignURLBuilder
          version={GAVersion.UniversalAnalytics}
          type={URLBuilderType.Web}
        />
      )
      const { findByLabelText: find, findByTestId } = renderer.render(wrapped)
      await userEvent.type(
        await find(/website URL/),
        "https://itunes.apple.com"
      )

      const warningBanner = await findByTestId("bad-url-warnings")

      expect(warningBanner).toBeVisible()
    })
  })
})
