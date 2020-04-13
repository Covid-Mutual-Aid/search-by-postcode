import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { usePlaceMethod, usePlaceState } from '../../contexts/StateContext'
import icons from '../../utils/icons'
import { InputGroup } from '../../styles/styles'

const SearchBox = () => {
  const [searchInput, setSearchInput] = useState('')
  const { onSearch, onSelect } = usePlaceMethod()
  const { search } = usePlaceState()
  return (
    <Styles>
      <form
        onSubmit={(e) => {
          e.preventDefault()

          if (searchInput.length > 1) {
            setSearchInput('')
            onSearch(searchInput)
            onSelect()
          }
        }}
      >
        <InputGroup>
          <input
            value={searchInput}
            placeholder="Enter place"
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit">{icons('search')}</button>
        </InputGroup>
      </form>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/add-group">
          <p className="add-group">Or add a group</p>
        </Link>
      </div>
      <div>
        {search.place && (
          <>
            <div style={{ padding: '0rem 1rem' }}>
              Showing groups for:{' '}
              <p style={{ fontWeight: 'bold' }}>
                {search.place.name} <span onClick={() => onSearch()}>clear</span>
              </p>
            </div>
          </>
        )}
      </div>
    </Styles>
  )
}

const Styles = styled.div`
  padding: 0 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);

  .clear {
    color: blue;
  }
  .add-group {
    padding: 0.5rem 1rem;
    color: blue;
    cursor: pointer;
  }
  .search {
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #8a8686;
    color: white;
  }
`

export default SearchBox
