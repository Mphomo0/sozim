import { extract, bestIdForDSpace } from '@/lib/oai-parser'

// Sample OAI-PMH XML blocks with different URL patterns
const testCases = [
  {
    name: 'E-LIS record with dc:relation',
    xml: `<record>
      <metadata>
        <oai_dc:dc>
          <dc:title>Test Article</dc:title>
          <dc:creator>John Doe</dc:creator>
          <dc:description>Test description</dc:description>
          <dc:relation>http://eprints.rclis.org/12345/</dc:relation>
          <dc:date>2024</dc:date>
        </oai_dc:dc>
      </metadata>
    </record>`
  },
  {
    name: 'DSpace record with Handle',
    xml: `<record>
      <metadata>
        <oai_dc:dc>
          <dc:title>Test Thesis</dc:title>
          <dc:creator>Jane Smith</dc:creator>
          <dc:identifier.uri>https://hdl.handle.net/20.500.12345/67890</dc:identifier.uri>
          <dc:date>2024</dc:date>
        </oai_dc:dc>
      </metadata>
    </record>`
  },
  {
    name: 'DSpace record with DOI',
    xml: `<record>
      <metadata>
        <oai_dc:dc>
          <dc:title>Test Paper</dc:title>
          <dc:creator>Bob Johnson</dc:creator>
          <dc:identifier.uri>https://doi.org/10.1000/test.123</dc:identifier.uri>
          <dc:date>2024</dc:date>
        </oai_dc:dc>
      </metadata>
    </record>`
  }
]

console.log('Testing URL extraction...\n')

testCases.forEach((testCase, index) => {
  console.log(`\n--- Test ${index + 1}: ${testCase.name} ---`)

  const identifierUris = extract(testCase.xml, 'dc:identifier.uri')
  const relations = extract(testCase.xml, 'dc:relation')

  console.log('  dc:identifier.uri:', identifierUris)
  console.log('  dc:relation:', relations)

  const allIdentifiers = [...identifierUris, ...relations]
  const result = bestIdForDSpace(allIdentifiers, 'test-repo')

  console.log('  Result:')
  console.log('    - URL:', result.url)
  console.log('    - Identifier:', result.identifier)
  console.log('    - Type:', result.identifierType)

  if (result.url) {
    console.log('  ✅ URL extracted successfully!')
  } else {
    console.log('  ❌ No URL found')
  }
})

console.log('\n--- Test Summary ---')
console.log('If all tests show ✅, URL extraction is working correctly.')
console.log('If tests show ❌, check the URL pattern matching logic.')
