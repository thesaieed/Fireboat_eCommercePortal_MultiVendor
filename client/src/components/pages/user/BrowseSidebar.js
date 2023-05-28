import {
  Menu,
  Slider,
  Select,
  Tag,
  InputNumber,
  Checkbox,
  Radio,
  Space,
} from "antd";
import { useState } from "react";

function BrowseSidebar() {
  const options = [
    {
      value: "Pencil",
    },
    {
      value: "Charts",
    },
    {
      value: "Canvas",
    },
    {
      value: "Ink",
    },
  ];
  const [sortValue, setSortValue] = useState(1);
  const onSortChange = (e) => {
    setSortValue(e.target.value);
  };
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
              <Radio value={1}>Price -- Low to High</Radio>
              <Radio value={2}>Price -- High to Low</Radio>
              <Radio value={3}>Newest First</Radio>
            </Space>
          </Radio.Group>
        </div>
      </div>
      <div>
        <hr />
      </div>
      <div className="sidebarSubHeading">
        <span>Category</span>
        <Menu theme="light" mode="inline">
          <Menu.Item
            key="1"
            style={{
              width: "100%",
              border: "1px solid lightgrey",
            }}
          >
            <Select
              placeholder="Select Categories"
              mode="multiple"
              showArrow
              tagRender={tagRender}
              // defaultValue={[]}
              style={{
                width: "100%",
              }}
              options={options}
            />
          </Menu.Item>
        </Menu>
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
          defaultValue={[20, 50]}
        />
        <div className="sidebarPriceDiv">
          <InputNumber placeholder="min" min={1} max={10} defaultValue={2} />
          <span>to</span>
          <InputNumber placeholder="max" min={1} max={10} defaultValue={10} />
        </div>
      </div>
      <div>
        <hr />
      </div>
      <div className="sidebarSubHeading">
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
      </div>

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
