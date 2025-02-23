import { translate } from '@docusaurus/Translate'
import { PackageList } from '@site/src/components/shared/Package/packageList'
import { IntegrationsList } from '@site/src/integrations'
import React from 'react'

export default function HomepageIntegrations(): JSX.Element {
  return (
    <PackageList
      packages={IntegrationsList}
      title={translate({ message: 'Integrations' })}
    />
  )
}
