import {
  Menu,
  Slider,
  Select,
  Tag,
  InputNumber,
  // Checkbox,
  Radio,
  Space,
  Button,
} from "antd";

function BrowseSidebar({
  sortValue,
  onSortChange,
  categories,
  onCategoryChange,
  priceRange,
  setPriceRange,
  sliderRange,
  selectedCategories,
  clearAllFilters,
}) {
  const categoryOptions = [];
  for (let category of categories) {
    categoryOptions.push({ value: category });
  }
  const tagRender = (props) => {
    const { label, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        // color="gold"
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{
          marginRight: 3,
        }}
      >
        {label}
      </Tag>
    );
  };

  const handleCategoryChange = (selectedcategories) => {
    onCategoryChange(selectedcategories);
  };

  const handlePriceSliderChange = (e) => {
    setPriceRange({ minPrice: e[0], maxPrice: e[1] });
  };

  const categoryMenuItems = [
    {
      label: (
        <Select
          placeholder="Select Categories"
          mode="multiple"
          showArrow
          tagRender={tagRender}
          // defaultValue={[]}
          value={selectedCategories}
          onChange={handleCategoryChange}
          style={{
            width: "100%",
            height: "100%",
          }}
          options={categoryOptions}
        />
      ),
      key: "browseCategory",
      style: {
        width: "95%",
        border: "1px solid lightgrey",
        height: "max-content",
        background: "none",
      },
    },
  ];

  return (
    <div className="homeSidebarDiv">
      <div className="sidebarHeading text-center">
        <span>Filters</span>
      </div>
      <div>
        <hr />
      </div>
      <div className="sidebarSubHeading">
        <div>Sort by</div>
        <div>
          <Radio.Group value={sortValue} onChange={onSortChange}>
            <Space direction="vertical">
              <Radio value={0}>Relevance</Radio>
              <Radio value={1}>Newest First</Radio>
              <Radio value={2}>Price -- Low to High</Radio>
              <Radio value={3}>Price -- High to Low</Radio>
            </Space>
          </Radio.Group>
        </div>
      </div>
      <div>
        <hr />
      </div>
      <div className="sidebarSubHeading ">
        <span>Category</span>
        <Menu
          theme="light"
          mode="inline"
          items={categoryMenuItems}
          className="categoryMenu"
        />
      </div>

      <div>
        <hr />
      </div>
      <div className="sidebarSubHeading">
        <span>Price</span>
        <Slider
          range={{
            draggableTrack: true,
          }}
          min={sliderRange.min}
          max={sliderRange.max}
          onChange={handlePriceSliderChange}
          value={[priceRange.minPrice, priceRange.maxPrice]}
          // step={Math.floor((priceRange.maxPrice - priceRange.minPrice) / 100)}
        />
        <div className="sidebarPriceDiv">
          <InputNumber
            placeholder="min"
            value={priceRange.minPrice}
            onChange={(e) => {
              setPriceRange({ ...priceRange, minPrice: e });
            }}
          />
          <span>to</span>
          <InputNumber
            placeholder="max"
            value={priceRange.maxPrice}
            onChange={(e) => {
              setPriceRange({ ...priceRange, maxPrice: e });
            }}
          />
        </div>
      </div>
      <div>
        <hr />
      </div>
      <div>
        <Button type="link" onClick={clearAllFilters}>
          Clear all Filters
        </Button>
      </div>

      {/* <div className="sidebarSubHeading">
        <div>Discount</div>
        <div>
          <Checkbox>10% or more</Checkbox>
        </div>
        <div>
          <Checkbox>20% or more</Checkbox>
        </div>
        <div>
          <Checkbox>30% or more</Checkbox>
        </div>

        <div>
          <Checkbox>40% or more</Checkbox>
        </div>
      </div>
      <div>
        <hr />
      </div>
      <div className="sidebarSubHeading">
        <span>Availability</span>
        <div>
          <Checkbox>Include out of Stock items</Checkbox>
        </div>
      </div> */}

      {/* <div className="aside-footer">
        <div
          className="footer-box"
          style={{
            background: color,
          }}
        >
          <span className="icon" style={{ color }}>
            {dashboard}
          </span>
          <h6>Need Help?</h6>
          <p>Please check our docs</p>
          <Button type="primary" className="ant-btn-sm ant-btn-block">
            DOCUMENTATION
          </Button>
        </div>
      </div> */}
    </div>
  );
}

export default BrowseSidebar;
